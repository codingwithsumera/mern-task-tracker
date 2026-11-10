import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
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
      <h2>Login</h2>

      {error && <Alert severity="error">{error}</Alert>}

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
        required
        fullWidth
      />

      <Button
        color="secondary"
        type="submit"
        variant="contained"
        disabled={loading}
        fullWidth
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Stack>
  );
}

export default Login;
