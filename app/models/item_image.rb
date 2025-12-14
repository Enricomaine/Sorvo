class ItemImage < ApplicationRecord 
  belongs_to :item 

  validates :image_url, presente: true 
  validates :main, inclusion: { in: [true, false] }

  validate :only_one_main_image_per_item

  private 

  def only_one_main_image_per_item
    return unless main 

    existing_main = ItemImage.where(item_id: item_id, main: true)
    if persisted?
      existing_main = existing_main.where.not(id: id)
    end

    if existing_main.exists?
      errors.add(:main, "This item already has a main image")
    end
  end
end