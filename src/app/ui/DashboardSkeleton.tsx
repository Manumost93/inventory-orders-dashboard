import * as React from "react";
import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import Grid from "@mui/material/GridLegacy";

export default function DashboardSkeleton() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Grid item xs={12} md={3} key={i}>
          <Card>
            <CardContent>
              <Skeleton width={90} />
              <Skeleton width={140} height={40} />
              <Skeleton width={160} />
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Skeleton width={180} />
            <Stack spacing={1} mt={2}>
              <Skeleton height={18} />
              <Skeleton height={18} />
              <Skeleton height={18} />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Skeleton width={180} />
            <Stack spacing={1} mt={2}>
              <Skeleton height={18} />
              <Skeleton height={18} />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Skeleton width={180} />
            <Stack spacing={1} mt={2}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height={24} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Skeleton width={180} />
            <Stack spacing={1} mt={2}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height={24} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
