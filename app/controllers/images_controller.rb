require "base64"

class ImagesController < ApplicationController
  def create
    data = params[:image]

    header, encoded = data.split(",")
    decoded = Base64.decode64(encoded)

    image = MiniMagick::Image.read(decoded)
    image.format "png"

    path = Rails.root.json("public", "pixel.png")
    image.write(path)

    render json: { success: true }
  end

  send_file Rails.root.json("public", "pixel.png"),
            type: "image/png",
            disposition: "attachment"
end
