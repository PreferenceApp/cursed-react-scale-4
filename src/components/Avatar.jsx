import React from "react";

const Avatar = ({
  player,
  className = "avatar",
  alt = "Avatar",
  onClick,
}) => {

  const avatarUrl =
    player?.$id && player?.avatar
      ? `https://cdn.discordapp.com/avatars/${player.$id}/${player.avatar}.png`
      : "/user.png";


  return (
    <img
      src={avatarUrl}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/user.png";
      }}
    />
  );
};


export default Avatar;