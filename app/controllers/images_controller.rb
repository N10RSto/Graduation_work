require "base64"

class ImagesController < ApplicationController
  def download
    path = Rails.root.join("public", "pixel.png")
    if File.exist?(path)
      send_file path, type: "image/png", disposition: "attachment"
    else
      render plain: "ファイルが存在しません", status: 404
    end
  end
end
