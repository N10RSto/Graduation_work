class AddEditorDataToIcons < ActiveRecord::Migration[7.2]
  def change
    add_column :icons, :grid_size, :integer
    add_column :icons, :pixels, :json
  end
end
