# Global base URL for building links across the app
# Priority: ENV["BASE_URL"] > computed from Action Mailer default_url_options
# Scheme: ENV["BASE_URL_SCHEME"] if present; otherwise honor force_ssl (https in prod, http in dev/test)

Rails.application.config.x.base_url = begin
  env_url = ENV["BASE_URL"]
  if env_url && !env_url.strip.empty?
    env_url.gsub(%r{/+$}, "")
  else
    default_opts = Rails.application.config.action_mailer.default_url_options || {}
    host = default_opts[:host]
    port = default_opts[:port]
    scheme = if ENV["BASE_URL_SCHEME"] && !ENV["BASE_URL_SCHEME"].strip.empty?
      ENV["BASE_URL_SCHEME"].strip
    else
      Rails.application.config.force_ssl ? "https" : "http"
    end

    # Fallbacks if host/port are missing
    host ||= "localhost"
    port ||= (Rails.env.development? ? 3000 : nil)

    [ "#{scheme}://", [ host, port ].compact.join(":") ].join
  end
end
