class Customer < ApplicationRecord
  belongs_to :seller
  belongs_to :user, dependent: :destroy
  belongs_to :price_table, optional: true

  accepts_nested_attributes_for :user

  has_many :orders

  enum :person_type, { person: 0, business: 1 }

  validates :legal_name, :trade_name, :person_type, presence: true 

  validate :cpf_must_be_valid, if: -> { person_type == "person"}
  validate :cnpj_must_be_valid, if: -> { person_type == "business" }

  before_validation :set_user_role

  private 

  def set_user_role 
    user&.role = :customer if user.present?
  end

  def cnpj_must_be_valid
    return if cnpj.blank?

    begin 
      Cnpj.new(cnpj)
    rescue ArgumentError => e
      errors.add(:cnpj, e.message)
    end
  end

  def cpf_must_be_valid
    return if cpf.blank?

    begin 
      Cpf.new(cpf)
    rescue ArgumentError => e
      errors.add(:cpf, e.message)
    end
  end
end
