class AddRoleToAdminUsers < ActiveRecord::Migration
  def self.up
  	add_column :admin_users, :role, :enum, :limit => CleanErp::ROLE_DEFINITION, :default => :other
  	AdminUser.reset_column_information  	
  	AdminUser.find_by_email("super_admin@example.com").update_attribute(:role, :super_admin)
  end

  def self.down
  	remove_column :admin_users, :role
  end
end
