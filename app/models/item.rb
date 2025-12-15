class Item < ApplicationRecord
  belongs_to :seller

  has_many_attached :images

  has_one :main_image_attachment, -> { where(name: "main_image") }, class_name: "ActiveStorage::Attachment"
  has_one_attached :main_image

  validates :code, :description, presence: true
  validate :must_have_main_image

  private

  def must_have_main_image
    errors.add(:main_image, "Must be added") unless main_image.attached?
  end
end
