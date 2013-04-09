class AdminUser < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, 
         :recoverable, :rememberable, :trackable, :validatable, :authentication_keys => [:tlogin]

  attr_accessor :tlogin

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :tlogin

  validates :tlogin, :uniqueness => true,  :presence => { :case_sensitive => false }

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
