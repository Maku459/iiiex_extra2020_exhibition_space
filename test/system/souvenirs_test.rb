require "application_system_test_case"

class SouvenirsTest < ApplicationSystemTestCase
  setup do
    @souvenir = souvenirs(:one)
  end

  test "visiting the index" do
    visit souvenirs_url
    assert_selector "h1", text: "Souvenirs"
  end

  test "creating a Souvenir" do
    visit souvenirs_url
    click_on "New Souvenir"

    fill_in "Impression", with: @souvenir.impression
    fill_in "Iris24 ", with: @souvenir.iris24_
    fill_in "Iris 11", with: @souvenir.iris_11
    fill_in "Iris 12", with: @souvenir.iris_12
    fill_in "Iris 13", with: @souvenir.iris_13
    fill_in "Iris 14", with: @souvenir.iris_14
    fill_in "Iris 21", with: @souvenir.iris_21
    fill_in "Iris 22", with: @souvenir.iris_22
    fill_in "Iris 23", with: @souvenir.iris_23
    fill_in "Iris 31", with: @souvenir.iris_31
    fill_in "Iris 32", with: @souvenir.iris_32
    fill_in "Iris 33", with: @souvenir.iris_33
    fill_in "Iris 34", with: @souvenir.iris_34
    fill_in "Works 1", with: @souvenir.works_1
    fill_in "Works 2", with: @souvenir.works_2
    fill_in "Works 3", with: @souvenir.works_3
    click_on "Create Souvenir"

    assert_text "Souvenir was successfully created"
    click_on "Back"
  end

  test "updating a Souvenir" do
    visit souvenirs_url
    click_on "Edit", match: :first

    fill_in "Impression", with: @souvenir.impression
    fill_in "Iris24 ", with: @souvenir.iris24_
    fill_in "Iris 11", with: @souvenir.iris_11
    fill_in "Iris 12", with: @souvenir.iris_12
    fill_in "Iris 13", with: @souvenir.iris_13
    fill_in "Iris 14", with: @souvenir.iris_14
    fill_in "Iris 21", with: @souvenir.iris_21
    fill_in "Iris 22", with: @souvenir.iris_22
    fill_in "Iris 23", with: @souvenir.iris_23
    fill_in "Iris 31", with: @souvenir.iris_31
    fill_in "Iris 32", with: @souvenir.iris_32
    fill_in "Iris 33", with: @souvenir.iris_33
    fill_in "Iris 34", with: @souvenir.iris_34
    fill_in "Works 1", with: @souvenir.works_1
    fill_in "Works 2", with: @souvenir.works_2
    fill_in "Works 3", with: @souvenir.works_3
    click_on "Update Souvenir"

    assert_text "Souvenir was successfully updated"
    click_on "Back"
  end

  test "destroying a Souvenir" do
    visit souvenirs_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Souvenir was successfully destroyed"
  end
end
