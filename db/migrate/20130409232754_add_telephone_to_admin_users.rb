class AddTelephoneToAdminUsers < ActiveRecord::Migration
  def change
    add_column :admin_users, :telephone, :string

  end
end
