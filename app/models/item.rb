class Item < ApplicationRecord
  belongs_to :seller

  has_many_attached :images

  has_one :main_image_attachment, -> { where(name: "main_image") }, class_name: "ActiveStorage::Attachment"
  has_one_attached :main_image

  validates :code, :description, presence: true
  validate :must_have_main_image

  private

  def must_have_main_image
  changes = respond_to?(:attachment_changes) ? attachment_changes : {}
  pending_change = changes[:main_image] || changes['main_image']
  has_pending = pending_change.present?
  errors.add(:main_image, "Must be added") unless main_image.attached? || has_pending
  end
end
