class Email 
  def initialize(value)
    @value = value
    raise ArgumentError, "Invalid email" unless valid_email?
  end

  def valid_email?
    (/\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]{2,}\z/i.match(@value))
  end

  def to_s 
    @value
  end
end