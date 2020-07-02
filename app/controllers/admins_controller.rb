require 'net/http'
require 'openssl'
require 'json'

class AdminsController < ApplicationController
  before_action :basic_auth

  def dailyco
    # http_basic_authenticate_with :name => ENV['BASIC_AUTH_USERNAME'], :password => ENV['BASIC_AUTH_PASSWORD'] if Rails.env == "production"
    url = URI("https://api.daily.co/v1/rooms")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)
    request["authorization"] = 'Bearer ' + ENV['DAILYCO_APIKEY']

    response = http.request(request)
    @rooms = JSON.parse(response.read_body)
  end
end
