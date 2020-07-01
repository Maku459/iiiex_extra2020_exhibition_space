require 'test_helper'

class WorksControllerTest < ActionDispatch::IntegrationTest
  test "should get pages" do
    get works_pages_url
    assert_response :success
  end

  test "should get list" do
    get works_list_url
    assert_response :success
  end

end
