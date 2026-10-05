using CrudDAPPER.Services.PedidoService;

namespace CrudDAPPER.Services.BackgroundServices
{
    public class ContratoVencimentoService : BackgroundService
    {
            private readonly IServiceProvider _provider;
            private readonly ILogger<ContratoVencimentoService> _logger;

            public ContratoVencimentoService(
                IServiceProvider provider,
                ILogger<ContratoVencimentoService> logger)
            {
                _provider = provider;
                _logger = logger;
            }

            protected override async Task ExecuteAsync(CancellationToken stoppingToken)
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        using var scope = _provider.CreateScope();
                        var repo = scope.ServiceProvider.GetRequiredService<IPedidoInterface>();
                        var total = await repo.EncerrarContratosVencidos();
                        if (total > 0)
                            _logger.LogInformation("{Total} contrato(s) encerrado(s).", total);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Erro ao encerrar contratos.");
                    }

                // Corre 1x por dia
                //await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                await Task.Delay(TimeSpan.FromHours(2), stoppingToken);
            }
            }
    }
}
