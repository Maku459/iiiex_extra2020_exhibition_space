class SpaceController < ApplicationController
  def index
  end

  def feedback1
  end

  def works
    works_name = ["audioracing", "omiage"]

    if params[:name] == "list" then
      @list = works_name
      render template: 'space/works_list', status: 200, layout: 'application', content_type: 'text/html'
      return
    end

    unless works_name.include?(params[:name]) then
      render file: Rails.root.join('public/404.html'), status: 404, layout: false, content_type: 'text/html'
      return
    end

    @name = params[:name]
  end
end
