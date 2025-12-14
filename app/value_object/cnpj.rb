class Cnpj
  def initialize(value)
    @value = value.to_s.gsub(/\D/, '')
    raise ArgumentError, "Invalid CNPJ" unless valid_CNPJ?
  end

  def valid_CNPJ?
    return false unless @value.length == 14
    
    first_dv = check_digit(@value[0..11])
    second_dv = check_digit(@value[0..11] + first_dv.to_s)

    @value[-2..-1] == "#{first_dv}#{second_dv}"
  end

  def to_s
    @value
  end

  private

  def check_digit(base)
    weights = [6,5,4,3,2,9,8,7,6,5,4,3,2]
    sum = 0
    base.chars.reverse.each_with_index do |char, i|
      sum += char.to_i * weights[-(i + 1)]
    end
    
    rest = sum % 11
    rest < 2 ? 0 : 11 - rest
  end
end