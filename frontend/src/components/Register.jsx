import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function Register() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register({ name, email, password });
      setSuccess("Account created successfully. You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={2}
      sx={{ width: "100%" }}
    >
      <Typography variant="h5">Create an account</Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
          htmlInput: { minLength: 8 },
        }}
        required
        fullWidth
        helperText="Minimum 8 characters"
      />

      <Button
        color="secondary"
        type="submit"
        variant="contained"
        disabled={loading}
        fullWidth
      >
        {loading ? "Creating account..." : "Register"}
      </Button>
    </Stack>
  );
}

export default Register;
