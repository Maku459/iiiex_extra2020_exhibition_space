require 'test_helper'

class SlackNotificationsControllerTest < ActionDispatch::IntegrationTest
  test "should get submit" do
    get slack_notifications_submit_url
    assert_response :success
  end

end
