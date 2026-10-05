using CrudDAPPER.Services.BackgroundServices;
using CrudDAPPER.Services.LivroService;
using CrudDAPPER.Services.PedidoService;
using CrudDAPPER.Services.PropriedadeService;
using CrudDAPPER.Services.UsuarioService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IUsuarioInterface, UsuarioService>();
builder.Services.AddScoped<IPropriedadeInterface, PropriedadeService>();
builder.Services.AddScoped<IPropriedadeStatusInterface, PropriedadeStatusService>();
builder.Services.AddScoped<IPropriedadeTipoInterface, PropriedadeTipoService>();
builder.Services.AddScoped<IPedidoInterface, PedidoService>();

builder.Services.AddHostedService<ContratoVencimentoService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// Habilita a pasta wwwroot para servir arquivos (ex: /imoveis/foto.jpg)
app.UseStaticFiles();

// IMPORTANTE: antes dos Controllers
app.UseCors("AllowNextJS");

app.UseAuthorization();

app.UseStaticFiles();

app.UseCors("AllowAll");
app.MapControllers();

app.MapControllers();

app.Run();
