class Seller < ApplicationRecord
  belongs_to :user, dependent: :destroy
  has_many :customers, dependent: :destroy
  has_many :price_tables, dependent: :destroy
  has_many :items, dependent: :destroy 
  has_many :orders, dependent: :destroy

  accepts_nested_attributes_for :user

  validates :legal_name, :trade_name, :cnpj, presence: true
  validate :cnpj_must_be_valid

  before_validation :set_user_role

  private 

  def set_user_role 
    user&.role = :seller if user.present?
  end

  def cnpj_must_be_valid
    return if cnpj.blank?

    begin
      Cnpj.new(cnpj)
    rescue ArgumentError => e 
      errors.add(:cnpj, e.message)
    end
  end
end