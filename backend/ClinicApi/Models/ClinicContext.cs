using ClinicApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicApi.Data;

public class ClinicContext : DbContext
{
    public ClinicContext(DbContextOptions<ClinicContext> options) : base(options)
    {
    }

    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
}