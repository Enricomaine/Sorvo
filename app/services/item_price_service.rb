class ItemPriceService
  def initialize(customer_id: nil, seller_id: nil)
    @customer_id = customer_id
    @seller_id = seller_id
  end

  def prices_for(item_ids)
    return {} if item_ids.blank?
    return base_prices(item_ids) if @customer_id.blank?

    sql = <<-SQL
      SELECT I.ID,
             I.CODE,
             I.DESCRIPTION,
             COALESCE(NULLIF(PI.FINAL_PRICE, 0), I.BASE_PRICE) AS PRICE
        FROM CUSTOMERS               C
        JOIN SELLERS                 S ON C.SELLER_ID = S.ID
        JOIN ITEMS                   I ON I.SELLER_ID = S.ID
        LEFT JOIN PRICE_TABLES       P ON P.ID = C.PRICE_TABLE_ID
                                      AND S.ID = P.SELLER_ID
                                      AND P.ACTIVE
        LEFT JOIN PRICE_TABLE_ITEMS PI ON P.ID = PI.PRICE_TABLE_ID
                                      AND I.ID = PI.ITEM_ID
       WHERE I.ID = ANY($1::bigint[])
         AND C.ID = $2
    SQL

    binds = [
      ActiveRecord::Relation::QueryAttribute.new("item_ids", item_ids, ActiveRecord::Type::Value.new),
      ActiveRecord::Relation::QueryAttribute.new("customer_id", @customer_id, ActiveRecord::Type::Value.new)
    ]

    ActiveRecord::Base.connection
      .exec_query(sql, "ItemPriceService#prices_for", binds)
      .to_a
      .index_by { |row| row["id"] }
  end

  private

  def base_prices(item_ids)
    Item.where(id: item_ids, seller_id: @seller_id)
    .map { |item| [ item.id, { "price" => item.base_price } ] }
    .to_h
  end
end
