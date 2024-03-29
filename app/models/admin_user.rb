class AdminUser < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, 
         :recoverable, :rememberable, :trackable, :validatable, :authentication_keys => [:tlogin]

  attr_accessor :tlogin

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :user_name, :tlogin, :role, :telephone, :organization

  #validates :tlogin, :uniqueness => true,  :presence => { :case_sensitive => false }
  validates :user_name, :uniqueness => true,  :presence => { :case_sensitive => false }
  validates :email, :uniqueness => true, :presence => { :case_sensitive => false }
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  validates :password, :presence => { :case_sensitive => false }, :on => :create
  validates_format_of :telephone, :with => /^1[35]\d{9}$|^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/, :allow_blank => true   

  before_destroy :prevent_if_last_admin

  def prevent_if_last_admin
    if self.role == :super_admin && AdminUser.where("role=?", :super_admin).count < 2
      errors.add(:base, :destroy_fails_if_last_admin)
      false # or errors.blank?
    end    
  end

  def higher_rank?(base_role)
    CleanErp::ROLE_DEFINITION.index(base_role) >= CleanErp::ROLE_DEFINITION.index(self.role)
  end

  def is_current_admin_user?(current_admin_user)
    self.id == current_admin_user.id
  end 

  private
  def self.find_first_by_auth_conditions(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:tlogin)
      where(conditions).where(["lower(user_name) = :value OR lower(email) = :value", {:value => login.downcase }]).first
    else
      where(conditions).first
    end
  end  
end
