require 'test_helper'

class UserpositionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @userposition = userpositions(:one)
  end

  test "should get index" do
    get userpositions_url
    assert_response :success
  end

  test "should get new" do
    get new_userposition_url
    assert_response :success
  end

  test "should create userposition" do
    assert_difference('Userposition.count') do
      post userpositions_url, params: { userposition: { userid: @userposition.userid, x: @userposition.x, y: @userposition.y, z: @userposition.z } }
    end

    assert_redirected_to userposition_url(Userposition.last)
  end

  test "should show userposition" do
    get userposition_url(@userposition)
    assert_response :success
  end

  test "should get edit" do
    get edit_userposition_url(@userposition)
    assert_response :success
  end

  test "should update userposition" do
    patch userposition_url(@userposition), params: { userposition: { userid: @userposition.userid, x: @userposition.x, y: @userposition.y, z: @userposition.z } }
    assert_redirected_to userposition_url(@userposition)
  end

  test "should destroy userposition" do
    assert_difference('Userposition.count', -1) do
      delete userposition_url(@userposition)
    end

    assert_redirected_to userpositions_url
  end
end
