const db = require("../../config/db");

exports.obtenerPagos = async (req, res) => {
    const { idUsuario } = req.params;
    try {
        const result = await db.query(`
            SELECT
                f.idfactura,
                f.numerofactura,
                f.fechaemision,
                f.fechavencimiento,
                f.subtotal,
                f.descuento,
                f.total,
                f.estado,
                COALESCE(SUM(p.monto), 0) AS pagado,
                (f.total - COALESCE(SUM(p.monto), 0)) AS saldo
            FROM pagos.factura f
            LEFT JOIN pagos.pago p ON f.idfactura = p.idfactura
            WHERE f.idestudiante = (SELECT idestudiante FROM estudiantes.estudiante WHERE idusuario = $1)
            GROUP BY f.idfactura
            ORDER BY f.fechaemision DESC
        `, [idUsuario]);

        const resumen = {
            totalDeuda: result.rows.reduce((acc, f) => acc + parseFloat(f.saldo || 0), 0).toFixed(2),
            facturasPendientes: result.rows.filter(f => f.estado === 'PENDIENTE').length,
            facturasTotal: result.rows.length
        };

        res.json({ success: true, facturas: result.rows, resumen });
    } catch (error) {
        console.error("Error pagos:", error);
        res.status(500).json({ success: false, message: "Error al obtener estado de cuenta" });
    }
};
