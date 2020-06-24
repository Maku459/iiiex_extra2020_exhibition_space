require "application_system_test_case"

class UserpositionsTest < ApplicationSystemTestCase
  setup do
    @userposition = userpositions(:one)
  end

  test "visiting the index" do
    visit userpositions_url
    assert_selector "h1", text: "Userpositions"
  end

  test "creating a Userposition" do
    visit userpositions_url
    click_on "New Userposition"

    fill_in "X", with: @userposition.x
    fill_in "Y", with: @userposition.y
    fill_in "Z", with: @userposition.z
    click_on "Create Userposition"

    assert_text "Userposition was successfully created"
    click_on "Back"
  end

  test "updating a Userposition" do
    visit userpositions_url
    click_on "Edit", match: :first

    fill_in "X", with: @userposition.x
    fill_in "Y", with: @userposition.y
    fill_in "Z", with: @userposition.z
    click_on "Update Userposition"

    assert_text "Userposition was successfully updated"
    click_on "Back"
  end

  test "destroying a Userposition" do
    visit userpositions_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Userposition was successfully destroyed"
  end
end
