# frozen_string_literal: true

class WhatsappBatchJob < ApplicationJob
  queue_as :default

  retry_on StandardError, wait: 10.seconds, attempts: 3

  # Perform batch sending. Expects params:
  # messages: [{ to: String, text: String }, ...]
  # min_ms: Integer, optional
  # max_ms: Integer, optional
  def perform(messages:, min_ms: nil, max_ms: nil, instance_id: nil, token: nil)
    service = WhatsappSenderService.new
    service.send_batch(
      messages: messages,
      min_ms: min_ms || WhatsappSenderService::DEFAULT_MIN_COOLDOWN_MS,
      max_ms: max_ms || WhatsappSenderService::DEFAULT_MAX_COOLDOWN_MS,
      instance_id: instance_id,
      token: token
    )
  end
end
