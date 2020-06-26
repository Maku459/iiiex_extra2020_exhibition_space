require 'net/http'

class SpaceController < ApplicationController
  def index
  end

  def works
    works_name = ["boyakerukyoukai", "kehai", "Inside-Out_Outside-In_Or"]

    if params[:name] == "list" then
      @list = works_name
      render template: 'space/works_list', status: 200, layout: 'application', content_type: 'text/html'
      return
    end

    unless works_name.include?(params[:name]) then
      render file: Rails.root.join('public/404.html'), status: 404, layout: false, content_type: 'text/html'
      return
    end

    # Get works page's html
    uri = URI.parse("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/works/%s/index.html" % params[:name])
    response = Net::HTTP.get_response(uri)

    @body = response.body
    @name = params[:name]

    render template: 'space/works_page', status: 200, layout: false, content_type: 'text/html'
  end
end
