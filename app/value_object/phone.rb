class Phone
  def initialize(value)
    @value = value.to_s.gsub(/\D/, "")
    raise ArgumentError, "Invalid phone" unless valid_phone?
  end

  def valid_phone?
    return false unless @value.length == 10 || @value.length == 11

    is_valid_DDD(@value[0..1].to_i)
  end

  def to_s
    @value
  end

  private

  def is_valid_DDD(ddd)
    valid_DDD = [ 68, 82, 96, 92, 97, 71, 85, 61, 27, 28, 62, 64, 98, 65, 66, 67, 31, 32,
    33, 34, 35, 37, 38, 91, 93, 94, 83, 41, 42, 43, 44, 45, 46, 81, 86, 21, 22, 24, 84, 51,
    53, 54, 55, 69, 95, 47, 48, 49, 11, 12, 13, 14, 15, 16, 17, 18, 19, 79, 63 ]

    valid_DDD.include?(ddd)
  end
end
