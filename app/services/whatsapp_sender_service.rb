require 'net/http'
require 'json'
require 'uri'

class WhatsappSenderService
  DEFAULT_MIN_COOLDOWN_MS = 800
  DEFAULT_MAX_COOLDOWN_MS = 2400

  class Error < StandardError; end

  def initialize(instance_id: ENV.fetch('EVOLUTION_INSTANCE_ID', nil), token: ENV.fetch('EVOLUTION_TOKEN', nil), base_url: ENV.fetch('EVOLUTION_BASE_URL', 'http://127.0.0.1:8081'))
    @instance_id = instance_id
    @token = token
    @base_url = base_url
  end

  def send_text(to:, text:, instance_id: nil, token: nil)
    iid, tkn = credentials_override(instance_id, token)
  post_json!("/message/sendText/#{iid}", { number: to, text: text }, auth_token: tkn)
  end

  def send_media(to:, url:, caption: nil, instance_id: nil, token: nil)
    iid, tkn = credentials_override(instance_id, token)
    payload = { number: to, caption: caption, media: url, mediatype: "document", mimetype: "application/pdf", }.compact
  post_json!("/message/sendMedia/#{iid}", payload, auth_token: tkn)
  end

  def send_batch(messages:, min_ms: DEFAULT_MIN_COOLDOWN_MS, max_ms: DEFAULT_MAX_COOLDOWN_MS, instance_id: nil, token: nil)
    raise Error, 'messages must be an Array' unless messages.is_a?(Array)
    results = []
    messages.each_with_index do |msg, idx|
      validate_message!(msg)

      mid = msg[:instance_id] || instance_id
      tkn = msg[:token] || token
      if msg[:text]
        results << send_text(to: msg[:to], text: msg[:text], instance_id: mid, token: tkn)
      elsif msg[:url]
        results << send_media(to: msg[:to], url: msg[:url], caption: msg[:caption], instance_id: mid, token: tkn)
      else
        raise Error, 'message must include :text or :url'
      end
      
      next if idx == messages.size - 1
      sleep_ms(rand(min_ms..max_ms))
    end
    results
  end

  private

  def validate_message!(msg)
    raise Error, 'each message must be a Hash' unless msg.is_a?(Hash)
    raise Error, 'message :to must be provided' unless msg.key?(:to)
    raise Error, 'message :to must be a non-empty String' unless msg[:to].is_a?(String) && !msg[:to].empty?

    has_text = msg.key?(:text) && msg[:text].is_a?(String) && !msg[:text].empty?
    has_url = msg.key?(:url) && msg[:url].is_a?(String) && !msg[:url].empty?
    raise Error, 'message must include :text or :url' unless has_text || has_url
  end

  def sleep_ms(ms)
    sleep(ms / 1000.0)
  end

  def credentials_override(instance_id, token)

    iid = instance_id
    tkn = token
    if iid.nil? || iid.empty? || tkn.nil? || tkn.empty?
      raise Error, 'Missing Evolution credentials for this operation'
    end
    [iid, tkn]
  end

  def post_json!(path, payload, auth_token: nil)
    uri = URI.join(@base_url, path)
    req = Net::HTTP::Post.new(uri)
    req["Content-Type"] = "application/json"
    req["apikey"] = auth_token if auth_token
    req.body = JSON.generate(payload)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == 'https'
    res = http.request(req)
    raise Error, "Evolution API error: #{res.code} #{res.body}" unless res.is_a?(Net::HTTPSuccess)
    JSON.parse(res.body)
  end
end
