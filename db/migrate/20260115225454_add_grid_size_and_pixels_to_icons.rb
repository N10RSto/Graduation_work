class AddGridSizeAndPixelsToIcons < ActiveRecord::Migration[7.2]
  def change
    add_column :icons, :grid_size, :integer unless column_exists?(:icons, :grid_size)
    add_column :icons, :pixels, :json unless column_exists?(:icons, :pixels)
  end
end
