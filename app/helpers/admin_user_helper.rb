module AdminUserHelper
	def translated_role_helper(user)
		I18n.t "role.#{user.role}"
	end	
end