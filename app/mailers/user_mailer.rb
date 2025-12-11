class UserMailer < ApplicationMailer
  def reset_password
    @user = params[:user]
    @token = params[:token]
    mail(to: @user.mail, subject: "Password Recovery")
  end
end
