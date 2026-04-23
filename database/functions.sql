USE oinksafe_db;

DELIMITER //

-- Calcular Saldo do Usuário
CREATE FUNCTION fn_calcular_saldo_usuario(p_id_usuario INT) 
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
    DECLARE v_total_receitas DECIMAL(10, 2) DEFAULT 0.00;
    DECLARE v_total_despesas DECIMAL(10, 2) DEFAULT 0.00;
    DECLARE v_saldo_final DECIMAL(10, 2) DEFAULT 0.00;

    -- Calcula o total de receitas
    SELECT IFNULL(SUM(t.valor), 0.00) INTO v_total_receitas
    FROM transacoes t
    JOIN categorias c ON t.id_categoria = c.id_categoria
    WHERE t.id_usuario = p_id_usuario AND c.tipo = 'receita';

    -- Calcula o total de despesas
    SELECT IFNULL(SUM(t.valor), 0.00) INTO v_total_despesas
    FROM transacoes t
    JOIN categorias c ON t.id_categoria = c.id_categoria
    WHERE t.id_usuario = p_id_usuario AND c.tipo = 'despesa';

    -- Subtrai as despesas das receitas para obter o saldo
    SET v_saldo_final = v_total_receitas - v_total_despesas;

    RETURN v_saldo_final;
END //

DELIMITER ;