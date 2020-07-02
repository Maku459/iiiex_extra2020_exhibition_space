class ApplicationController < ActionController::Base
  def basic_auth
    if Rails.env == "production"
      authenticate_or_request_with_http_basic do |user, pass|
        user == ENV["BASIC_AUTH_USER"] && ENV["BASIC_AUTH_PASSWORD"]
      end
    end
  end
end
