require 'net/http'
require 'json'

class SlackNotificationsController < ApplicationController
  protect_from_forgery with: :exception

  def submit
    res = submit_incoming_webhook 'hello'
    @res = res.body

    respond_to do |format|
      format.html { render :submit }
      format.json { render json: {response: res.body, status: res.code}, status: res.code }
    end
  end

  def entered_page
    unless Work::WORKS_NAMES.include?(params[:work_name]) then
      render json: {response: 'work not found.'}, status: 404
    end

    message = <<-EOS
<https://extra2020.iiiexhibition.com/works/#{params[:work_name]}|#{Work::WORKS_INFO[params[:work_name]]['name']}>にお客さんがきました．

通話リンク: #{Work::WORKS_INFO[params[:work_name]]['daily_co_url']}
    EOS

    notification_text = <<-EOS
#{Work::WORKS_INFO[params[:work_name]]['name']}で通話が開始されました．
    EOS

    post_params = {
        "text" => notification_text,
        "blocks" => [
            {
                "type" => "section",
                "text" => {
                    "type" => "mrkdwn",
                    "text" => message
                },
            },
            {
                "type" => "divider"
            }
        ]
    }

    res = submit_incoming_webhook post_params
    render json: {response: res}, status: res.code
  end

  def daily_co_start
    unless Work::WORKS_NAMES.include?(params[:work_name]) then
      render json: {response: 'work not found.'}, status: 404
    end

    message = <<-EOS
@here <https://extra2020.iiiexhibition.com/works/#{params[:work_name]}|#{Work::WORKS_INFO[params[:work_name]]['name']}>で通話が開始されました．
お客さんに説明をお願いします．

通話リンク: #{Work::WORKS_INFO[params[:work_name]]['daily_co_url']}
    EOS
    notification_text = <<-EOS
#{Work::WORKS_INFO[params[:work_name]]['name']}で通話が開始されました．
    EOS

    post_params = {
        "text" => notification_text,
        "blocks" => [
            {
                "type" => "section",
                "text" => {
                    "type" => "mrkdwn",
                    "text" => message
                },
                "accessory" => {
                    "type" => "image",
                    "image_url" => "https://object-storage.tyo2.conoha.io/v1/nc_7d0030b822e246239683a325ebfb1974/iiiex/img/" + Work::WORKS_INFO[params[:work_name]]['image'],
                    "alt_text" => params[:work_name]
                }
            },
            {
                "type" => "divider"
            }
        ]
    }

    res = submit_incoming_webhook post_params
    render json: {response: res}, status: res.code
  end

  private

  def submit_incoming_webhook(post_params)
    uri = URI.parse("https://hooks.slack.com/services/%s" % ENV['SLACK_INCOMING_WEBHOOK_TOKEN'])
    logger.debug(uri.path)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true


    req = Net::HTTP::Post.new(uri.path)
    req.set_form_data(payload: post_params.to_json)

    return http.request(req)
  end
end
