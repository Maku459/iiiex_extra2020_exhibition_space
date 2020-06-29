require 'test_helper'

class SouvenirsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @souvenir = souvenirs(:one)
  end

  test "should get index" do
    get souvenirs_url
    assert_response :success
  end

  test "should get new" do
    get new_souvenir_url
    assert_response :success
  end

  test "should create souvenir" do
    assert_difference('Souvenir.count') do
      post souvenirs_url, params: { souvenir: { impression: @souvenir.impression, iris_11: @souvenir.iris_11, iris_12: @souvenir.iris_12, iris_13: @souvenir.iris_13, iris_14: @souvenir.iris_14, iris_21: @souvenir.iris_21, iris_22: @souvenir.iris_22, iris_23: @souvenir.iris_23, iris_24: @souvenir.iris_24, iris_31: @souvenir.iris_31, iris_32: @souvenir.iris_32, iris_33: @souvenir.iris_33, iris_34: @souvenir.iris_34, works_1: @souvenir.works_1, works_2: @souvenir.works_2, works_3: @souvenir.works_3 } }
    end

    assert_redirected_to souvenir_url(Souvenir.last)
  end

  test "should show souvenir" do
    get souvenir_url(@souvenir)
    assert_response :success
  end

  test "should get edit" do
    get edit_souvenir_url(@souvenir)
    assert_response :success
  end

  test "should update souvenir" do
    patch souvenir_url(@souvenir), params: { souvenir: { impression: @souvenir.impression, iris_11: @souvenir.iris_11, iris_12: @souvenir.iris_12, iris_13: @souvenir.iris_13, iris_14: @souvenir.iris_14, iris_21: @souvenir.iris_21, iris_22: @souvenir.iris_22, iris_23: @souvenir.iris_23, iris_24: @souvenir.iris_24, iris_31: @souvenir.iris_31, iris_32: @souvenir.iris_32, iris_33: @souvenir.iris_33, iris_34: @souvenir.iris_34, works_1: @souvenir.works_1, works_2: @souvenir.works_2, works_3: @souvenir.works_3 } }
    assert_redirected_to souvenir_url(@souvenir)
  end

  test "should destroy souvenir" do
    assert_difference('Souvenir.count', -1) do
      delete souvenir_url(@souvenir)
    end

    assert_redirected_to souvenirs_url
  end
end
