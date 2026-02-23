import React, { useMemo } from "react";
import { Card, CardBody, Button, Skeleton } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaDollarSign,
  FaClipboardList,
  FaTriangleExclamation,
  FaBoxesStacked,
  FaArrowRight,
} from "react-icons/fa6";
import { Link } from "react-router";

import { useProducts } from "../../Products/hooks/useProducts";
import { useAdminOrders } from "../hook/useAdminOrders";
import { LowStockTable } from "../components/LowStockTable";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const AdminDashboard = () => {
  const { data: products = [], isLoading: loadingProducts } = useProducts({});
  const { data: orders = [], isLoading: loadingOrders } = useAdminOrders();

  const isLoading = loadingProducts || loadingOrders;

  const dashboardData = useMemo(() => {
    if (isLoading) return null;

    const totalSales = orders.reduce(
      (sum: any, order: { total: any }) => sum + order.total,
      0,
    );

    const pendingOrders = orders.filter(
      (o: { status: string }) => o.status === "Pending",
    ).length;

    const lowStockCount = products.filter(
      (p) => p.stock <= p.stock_min,
    ).length;

    const inventoryVal = products.reduce(
      (acc, p) => acc + p.price * p.stock,
      0,
    );

    const productSalesMap: Record<string, number> = {};
    orders.forEach((order: { items: any[] }) => {
      order.items.forEach(
        (item: { product: { name: any }; quantity: number }) => {
          const name = item.product.name;
          productSalesMap[name] =
            (productSalesMap[name] || 0) + item.quantity;
        },
      );
    });

    const topProducts = Object.entries(productSalesMap)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    const categoryMap: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || "Sin Categoría";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categoryData = Object.entries(categoryMap).map(
      ([name, value]) => ({ name, value }),
    );

    return {
      totalSales,
      pendingOrders,
      lowStockCount,
      inventoryVal,
      topProducts,
      categoryData,
    };
  }, [products, orders, isLoading]);

  if (isLoading || !dashboardData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const KPIS = [
    {
      title: "Ventas Totales",
      value: `$${dashboardData.totalSales.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}`,
      icon: <FaDollarSign />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Órdenes Pendientes",
      value: dashboardData.pendingOrders,
      icon: <FaClipboardList />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Alertas de Stock",
      value: dashboardData.lowStockCount,
      icon: <FaTriangleExclamation />,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Valor Inventario",
      value: `$${dashboardData.inventoryVal.toLocaleString("en-US")}`,
      icon: <FaBoxesStacked />,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel Administrativo</h1>
          <p className="text-gray-500">
            Estado general y métricas clave del negocio
          </p>
        </div>
        <Button
          as={Link}
          to="/admin/inventory"
          color="primary"
          variant="flat"
          endContent={<FaArrowRight />}
        >
          Gestionar Inventario
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {KPIS.map((kpi, i) => (
          <Card key={i}>
            <CardBody className="flex items-center gap-4 p-6">
              <div className={`p-4 rounded-xl text-2xl ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* TOP PRODUCTOS – VERTICAL */}
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4">
            Top Productos Más Vendidos
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.topProducts}
                margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a5b4fc" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  type="category"
                  angle={-20}
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                />
                <YAxis type="number" />
                <Tooltip />
                <Bar
                  dataKey="sales"
                  fill="url(#barGradient)"
                  barSize={40}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* DISTRIBUCIÓN POR CATEGORÍA */}
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-4">
            Distribución por Categoría
          </h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {dashboardData.categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* TABLA */}
      <Card>
        <div className="p-4">
          <LowStockTable products={products} />
        </div>
      </Card>
    </div>
  );
};
