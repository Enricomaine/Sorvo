class Cpf
  def initialize(value)
    @value = value.to_s.gsub(/\D/, "")
    raise ArgumentError, "Invalid CPF" unless valid_CPF?
  end

  def valid_CPF?
    return false unless @value.length == 11

    first_dv = check_digit(@value[0..8])
    second_dv = check_digit(@value[0..8] + first_dv.to_s)

    @value[-2..-1] == "#{first_dv}#{second_dv}"
  end

  def to_s
    @value
  end

  private

  def check_digit(base)
    weights = [ 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
    sum = 0
    base.chars.reverse.each_with_index do |char, i|
      sum += char.to_i * weights[-(i + 1)]
    end

    rest = sum % 11
    rest < 2 ? 0 : 11 - rest
  end
end
