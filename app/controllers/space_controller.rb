class SpaceController < ApplicationController
  def index
  end

  def feedback1
  end

  def works
    works_name = ["audioracing", "omiage"]

    unless works_name.include?(params[:name]) then
      render file: Rails.root.join('public/404.html'), status: 404, layout: false, content_type: 'text/html'
    end

    @name = params[:name]
  end
end
