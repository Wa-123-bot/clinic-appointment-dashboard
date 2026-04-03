using ClinicApi.Data;
using ClinicApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ClinicContext>(options =>
    options.UseSqlite("Data Source=clinic.db"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("frontend");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ClinicContext>();
    db.Database.EnsureCreated();
}

app.MapGet("/", () => "Clinic API is running");

app.MapGet("/api/patients", async (ClinicContext db) =>
    await db.Patients.OrderByDescending(p => p.Id).ToListAsync());

app.MapPost("/api/patients", async (Patient patient, ClinicContext db) =>
{
    db.Patients.Add(patient);
    await db.SaveChangesAsync();
    return Results.Created($"/api/patients/{patient.Id}", patient);
});

app.MapGet("/api/appointments", async (ClinicContext db) =>
    await db.Appointments.OrderByDescending(a => a.Id).ToListAsync());

app.MapPost("/api/appointments", async (Appointment appointment, ClinicContext db) =>
{
    db.Appointments.Add(appointment);
    await db.SaveChangesAsync();
    return Results.Created($"/api/appointments/{appointment.Id}", appointment);
});

app.MapPut("/api/appointments/{id}/status", async (int id, UpdateStatusRequest request, ClinicContext db) =>
{
    var appointment = await db.Appointments.FindAsync(id);
    if (appointment is null) return Results.NotFound();

    appointment.Status = request.Status;
    await db.SaveChangesAsync();
    return Results.Ok(appointment);
});

app.Run();

public record UpdateStatusRequest(string Status);