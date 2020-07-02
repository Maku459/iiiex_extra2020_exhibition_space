require 'nokogiri'

class WorksController < ApplicationController
  before_action :basic_auth

  def pages
    unless Work::WORKS_NAMES.include?(params[:name]) then
      render file: Rails.root.join('public/404.html'), status: 404, layout: false, content_type: 'text/html'
      return
    end

    # Get works page's html
    uri = URI.parse("https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/works/%s/index.html" % params[:name])
    response = Net::HTTP.get_response(uri)

    doc = response.body.gsub(/="\.\//, "=\"https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/works/%s/" % params[:name])
    doc = Nokogiri::HTML.parse(doc)

    @head = doc.xpath('/html/head')[0]
    @body = doc.xpath('html/body')[0]
    @doc = doc
    @name = params[:name]

    render template: 'works/pages', status: 200, layout: false, content_type: 'text/html'
  end

  def list
  end
end
