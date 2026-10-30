import { Image, Text, View } from "react-native";
import { router } from "expo-router";
import type { Property } from "@/lib/types";
import icons from "@/constants/icons";
import { SPACE, shadow } from "@/lib/responsive";
import { FadeInUp, IconButton, Skeleton, Touchable } from "./ui";

const money = (n: number) =>
  `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

/** Shared label so grid and list variants announce identically. */
const a11yLabel = (p: Property) =>
  `${p.name}, ${p.type}, ${money(p.price)}, rated ${p.rating} out of 5${
    p.address ? `, ${p.address}` : ""
  }`;

function Rating({ value }: { value: number }) {
  return (
    <View className="flex-row items-center gap-2xs rounded-full bg-white/90 dark:bg-black/60 px-xs py-2xs">
      <Image source={icons.star} style={{ width: 14, height: 14 }} accessible={false} alt="" />
      {/* Number is also text, so rating never depends on colour alone. */}
      <Text className="text-caption font-rubik-bold text-black-300 dark:text-white">{value}</Text>
    </View>
  );
}

/** Small heart button overlaying the top-right corner of the card image. */
function HeartButton({
  isFavorite,
  onToggle,
}: {
  isFavorite: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="absolute top-xs right-xs">
      <IconButton
        icon={icons.heart}
        label={isFavorite ? "Remove from saved" : "Save property"}
        // Tinted filled when saved, outline when not — the heart asset is a
        // filled heart; the icon component takes a tintColor, so we tint it
        // primary when active and a muted grey when not to suggest outline.
        tintColor={isFavorite ? "#0061FF" : "#FFFFFFCC"}
        onPress={onToggle}
        className="bg-black/30 rounded-full"
      />
    </View>
  );
}

/* --------------------------------------------------------------- Grid card */
export function PropertyCard({
  item,
  index = 0,
  isFavorite,
  onToggleFavorite,
}: {
  item: Property;
  index?: number;
  /** Whether the signed-in user has saved this property. */
  isFavorite?: boolean;
  /** Called when the user taps the heart. If omitted the heart is hidden. */
  onToggleFavorite?: () => void;
}) {
  return (
    <FadeInUp index={index} className="flex-1">
      <Touchable
        onPress={() => router.push(`/properties/${item.id}`)}
        accessibilityLabel={a11yLabel(item)}
        accessibilityHint="Opens the property details"
        className="rounded-lg overflow-hidden bg-surface dark:bg-surface-dark-muted border border-line dark:border-line-dark"
        style={{ flex: 1, ...shadow({ opacity: 0.08, radius: 12, offsetY: 6, elevation: 3 }) }}
      >
        <View className="relative">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: 160 }}
              resizeMode="cover"
              accessible={false}
              alt=""
            />
          ) : (
            <View className="w-full h-40 bg-surface-sunken dark:bg-surface-dark-elevated" />
          )}
          <View className="absolute top-xs right-xs">
            <Rating value={item.rating} />
          </View>
          {onToggleFavorite && isFavorite !== undefined ? (
            <HeartButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
          ) : null}
          <View className="absolute bottom-xs left-xs rounded-full bg-primary-300/90 px-xs py-2xs">
            <Text className="text-caption font-rubik-semibold text-white">{item.type}</Text>
          </View>
        </View>

        <View className="p-sm">
          <Text
            numberOfLines={1}
            className="text-body font-rubik-bold text-black-300 dark:text-white"
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            className="text-caption font-rubik text-black-100 dark:text-white/50 mt-2xs"
          >
            {item.address}
          </Text>
          <Text className="text-body font-rubik-extrabold text-primary-300 mt-xs">
            {money(item.price)}
          </Text>
        </View>
      </Touchable>
    </FadeInUp>
  );
}

/* --------------------------------------------------------------- List card */
export function PropertyRow({
  item,
  index = 0,
  isFavorite,
  onToggleFavorite,
}: {
  item: Property;
  index?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}) {
  return (
    <FadeInUp index={index}>
      <Touchable
        onPress={() => router.push(`/properties/${item.id}`)}
        accessibilityLabel={a11yLabel(item)}
        accessibilityHint="Opens the property details"
        style={{ marginBottom: SPACE.sm }}
        className="flex-row items-center gap-md p-sm rounded-lg bg-surface dark:bg-surface-dark-muted border border-line dark:border-line-dark"
      >
        <View className="relative">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={{ width: 96, height: 96 }}
              className="rounded-md"
              resizeMode="cover"
              accessible={false}
              alt=""
            />
          ) : (
            <View className="size-24 rounded-md bg-surface-sunken dark:bg-surface-dark-elevated" />
          )}
          {onToggleFavorite && isFavorite !== undefined ? (
            <View className="absolute top-0 right-0">
              <IconButton
                icon={icons.heart}
                label={isFavorite ? "Remove from saved" : "Save property"}
                tintColor={isFavorite ? "#0061FF" : "#FFFFFFCC"}
                onPress={onToggleFavorite}
                className="bg-black/30 rounded-full"
              />
            </View>
          ) : null}
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-xs">
            <Text
              numberOfLines={1}
              className="flex-1 text-body font-rubik-bold text-black-300 dark:text-white"
            >
              {item.name}
            </Text>
            <Rating value={item.rating} />
          </View>
          <Text
            numberOfLines={1}
            className="text-caption font-rubik text-black-100 dark:text-white/50 mt-2xs"
          >
            {item.address}
          </Text>
          <View className="flex-row items-center justify-between mt-xs">
            <Text className="text-body font-rubik-extrabold text-primary-300">
              {money(item.price)}
            </Text>
            <Text className="text-caption font-rubik text-black-200 dark:text-white/60">
              {item.bedrooms} bd · {item.bathrooms} ba
            </Text>
          </View>
        </View>
      </Touchable>
    </FadeInUp>
  );
}

/** Matches PropertyCard's box so the grid doesn't reflow when data arrives. */
export function PropertyCardSkeleton() {
  return (
    <View className="flex-1 rounded-lg overflow-hidden bg-surface dark:bg-surface-dark-muted border border-line dark:border-line-dark">
      <Skeleton className="w-full h-40 rounded-none" />
      <View className="p-sm gap-xs">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </View>
    </View>
  );
}
