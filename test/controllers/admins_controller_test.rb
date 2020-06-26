require 'test_helper'

class AdminsControllerTest < ActionDispatch::IntegrationTest
  test "should get dailyco" do
    get admins_dailyco_url
    assert_response :success
  end

end
