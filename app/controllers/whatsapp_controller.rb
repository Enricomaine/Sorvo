class WhatsappController < ApplicationController
  # POST /whatsapp/send_batch
  def send_batch
    permitted = params.permit(
      :min_ms,
      :max_ms,
      :async,
      :instance_id,
      :token,
      messages: [:to, :text, :url, :caption, :instance_id, :token]
    )
    messages = permitted[:messages]
    min_ms = permitted[:min_ms]
    max_ms = permitted[:max_ms]
    batch_instance_id = permitted[:instance_id]
    batch_token = permitted[:token]
    async = ActiveModel::Type::Boolean.new.cast(permitted[:async])

    unless messages.is_a?(Array) && messages.all? { |m|
      params_obj = m.is_a?(ActionController::Parameters) ? m : ActionController::Parameters.new(m)
      params_obj[:to].present? && (params_obj[:text].present? || params_obj[:url].present?)
    }
      return render json: { error: 'messages must be an array of { to, text } or { to, url, caption? }' }, status: :unprocessable_entity
    end

    normalized = messages.map do |m|
      {
        to: m[:to] || m['to'],
        text: m[:text] || m['text'],
        url: m[:url] || m['url'],
        caption: m[:caption] || m['caption'],
        instance_id: m[:instance_id] || m['instance_id'],
        token: m[:token] || m['token']
      }.compact
    end

    if async
      WhatsappBatchJob.perform_later(messages: normalized, min_ms: min_ms, max_ms: max_ms, instance_id: batch_instance_id, token: batch_token)
      render json: { status: 'queued', count: normalized.size }
    else
      service = WhatsappSenderService.new
      results = service.send_batch(messages: normalized, min_ms: min_ms, max_ms: max_ms, instance_id: batch_instance_id, token: batch_token)
      render json: { status: 'sent', count: results.size, results: results }
    end
  rescue WhatsappSenderService::Error => e
    render json: { error: e.message }, status: :bad_request
  rescue StandardError => e
    Rails.logger.error("WhatsApp send_batch failed: #{e.class} - #{e.message}\n#{e.backtrace&.join("\n")}")
    render json: { error: 'internal_error' }, status: :internal_server_error
  end
end
