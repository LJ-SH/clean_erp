class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_i18n_locale  

  protected
  
  def set_i18n_locale
    I18n.locale ||= I18n.default_locale
    I18n.locale = session[:locale] unless session[:locale].nil?
    if params[:locale]
    	if I18n.available_locales.include?(params[:locale].to_sym)   			
        I18n.locale = params[:locale]
     	else
        flash.now[:notice] = "#{params[:locale]} translation not available"
   	    logger.error flash.now[:notice]
     	end
    end
  end

  def after_sign_in_path_for(resource_or_scope)
    session[:locale] = I18n.locale
    stored_location_for(resource_or_scope) || signed_in_root_path(resource_or_scope)
  end

  #def default_url_options(options={})
  #  logger.debug "default_url_options is passed options: #{options.inspect}"
  #  options.merge!(:locale => I18n.locale)
  #end

end
