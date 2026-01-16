class IconsController < ApplicationController
  before_action :require_login

  def create
    icon = current_user.icons.build(
      grid_size: params[:grid_size],
      pixels: params[:pixels].to_json
    )

    icon.image.attach(base64_to_file(params[:image]))

    if icon.save
      head :ok
    else
      render json: { error: "保存失敗" }, status: :unprocessable_entity
    end
  rescue => e
    Rails.logger.error "Icon create failed: #{e.message}\n#{e.backtrace.join("\n")}"
    render json: { error: e.message }, status: :internal_server_error
  end

  def destroy
    icon = current_user.icons.find(params[:id])
    icon.destroy
    redirect_to mypage_path, notice: "削除しました", status: :see_other
  end

  def show
    icon = current_user.icons.find(params[:id])

    redirect_to root_path(edit_icon_id: icon.id)
  end

  private

  def base64_to_file(base64)
    header, data = base64.split(',')
    decoded = Base64.decode64(data)

    tempfile = Tempfile.new(['icon', '.png'])
    tempfile.binmode
    tempfile.write(decoded)
    tempfile.rewind

    {
      io: tempfile,
      filename: "icon.png",
      content_type: "image/png"
    }
  end
end