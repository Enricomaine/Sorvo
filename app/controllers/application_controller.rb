class ApplicationController < ActionController::API
  before_action :authenticate_request!
  rescue_from ArgumentError, with: :handle_enum_argument_error

  def authenticate_request!
    header = request.headers["Authorization"]
    header = header.split(" ").last if header.present?

    begin
      decode = JWT.decode(header, Rails.application.secret_key_base)[0]
      @current_user = User.find(decode["user_id"])
    rescue => e
      render json: { error: "Invalid session", message: e.message }, status: :unauthorized
    end
  end

  private

  def handle_enum_argument_error(exception)
    if match = exception.message.match(/'(?<value>\w+)' id not a valid (?<enum>\w+)/)
      value = match[:value]
      enum = match[:enum]
      model = find_model_with_enum(enum)

      valid_values = model ? model.send(enum.pluralize).keys : []

      render json: {
        error: "Invalid value for key '#{enum}'",
        value_received: value,
        allowed_values: valid_values
      }, status: :unprocessable_content
    else
      raise exception
    end

    def find_model_with_enum(enum_name)
      [ User, Customer, Seller, Order ].find do |model|
        model.respond_to?(enum_name.pluralize)
      end
    end
  end

  def get_seller_id
    if get_customer_id.present?
      return @current_user.customer.seller.id
    end

    @current_user.seller&.id
  end

  def get_customer_id
    @current_user.customer&.id
  end

  def require_role(*roles)
    unless roles.map(&:to_s).include?(@current_user.role)
      render json: { error: "Access denied" }, status: :forbidden
    end
  end
end
