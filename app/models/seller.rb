class Seller < ApplicationRecord
  belongs_to :user, dependent: :destroy
  has_many :customers, dependent: :destroy
  has_many :price_tables, dependent: :destroy
  has_many :items, dependent: :destroy
  has_many :orders, dependent: :destroy

  accepts_nested_attributes_for :user

  enum :person_type, { person: 0, business: 1 }

  validates :name, :document, :person_type, presence: true

  before_validation :set_user_role

  validate :cpf_must_be_valid, if: -> { person_type == "person" }
  validate :cnpj_must_be_valid, if: -> { person_type == "business" }

  private

  def set_user_role
    user&.role = :seller if user.present?
  end

  def cnpj_must_be_valid
    return if document.blank?

    begin
      Cnpj.new(document)
    rescue ArgumentError => e
      errors.add(:document, e.message)
    end
  end

  def cpf_must_be_valid
    return if document.blank?

    begin
      Cpf.new(document)
    rescue ArgumentError => e
      errors.add(:document, e.message)
    end
  end
end
