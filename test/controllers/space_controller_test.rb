require 'test_helper'

class SpaceControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get space_index_url
    assert_response :success
  end

end
